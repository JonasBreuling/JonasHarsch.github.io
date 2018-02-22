---
layout: post
title:  Using CMake for fortran
date:   2018-02-21 22:13:00 +0300
description: Topic of this post is fortran and how we can compile code in different ways. In the end I will present a clean and easy CMake file.
img: cmake-fortran/titlepage.svg # Add image post (optional)
tags: [cmake, fortran]
author: Jonas Harsch # Add name author (optional)
---

Hey together,
topic of this post is **fortran** and how we can compile code in different ways.

1. First I will discuss how **fortran** code can be compiled using the *command line*
2. In the second part I will present you how this can be done using a hand crafted `Makefile`
3. In the end and this will be the main part of this post I will show you how *CMake* can be used to have a comfortable and state of the art build system which generates us a `Makefile`

In the following we use a really simple fortran code as example. The structure of the code and the files looks like this

```bash
project_dir
└── src
     ├── main.f90
     └── do_something.f90
```

Where the two files `main.f90` and `do_something.f90` are two simple fortan snippets.

```fortran
! main.f90
program main
    use do_something, only: write_text

    character(5) :: text = "hello"

    call write_text(text)

end program main

! do_something.f90
module do_something
    implicit none
    private
    public :: write_text

contains

subroutine write_text(text)
    character(len = *), intent(in) :: text

    write(*,*) "Chosen Text is: ", text

end subroutine write_text

end module do_something
```

## Compile a simple fortran code I (command line)

This example code can be compiled via command line using a fortran compiler (e.g. [gfortran](https://gcc.gnu.org/wiki/GFortran), or [ifort](https://software.intel.com/en-us/fortran-compilers)) by typing

```bash
gfortran -O3 -Wall do_something.f90 main.f90 -o main
```

where we have used some compiler flags (defining the behaviour of the compiler, see [here](https://gcc.gnu.org/onlinedocs/gfortran/Option-Summary.html)). After the compilation is finished we can run the file using

```bash
./main
```

which results in the outoput

```
Chosen Text is: hello
```

If the structure of a project gets more complicated (multiple source files in different directories, adding libraries to the project, or we often want to adapt compiler flags) it gets anoining repetitively writing the compilation commands.

## Compile a simple fortran code II (Makefile)

For eliminating the downsides of complicated and anoning compilation typing we can use so called `Makefiles`. All compiler flags and source files are named there and we can simply type `make` which compiles the program or `make clean` that deletes alles files created by the `Makefile`.

A somehow standard `Makefile` for the fortran files above can look like this

```
# define variable for compiler and linker
LD = gfortran
FC = gfortran

# define compiler flags
FCLAGS = -O3 -Wall
# define linker flags
FLFLAGS =

# define main program
PROGRAM = main.f90

# replace .f90 with no ending
PROGRAM_NAME = $(PROGRAM:%.f90=%)

# define list of object files
SRC = \
 do_something.f90

# build object files (replace .f90 with .o)
OBJS = $(SRC:%.f90=%.o)

# build module files (replace .f90 with .o)
MODS = $(SRC:%.f90=%.mod)

# build a .mod file for every .o file
%.o : %.mod

# set suffixes we are interested in
.SUFFIXES: .f90 .o

# define the program to build
all: $(PROGRAM_NAME)

# compiler steps for all objects
.f90.o:
 $(FC) $(FFLAGS) -c $< -o $@

# liniking all the object files to the target
$(PROGRAM_NAME):: $(OBJS) $(MAKEFILE)
 @$(LD) $(FLFLAGS) $(OBJS) $(PROGRAM) -o $(PROGRAM_NAME)

# PHONY targets are always build new (prevents problems with a clean.f90 file)
.PHONY: clean

# delete all generated files
clean:
 $(RM) $(PROGRAM_NAME) $(OBJS) $(MODS)
```

By typing `make`in the command line, the makefile builds us the executable as we have done in the previous section.

Now you will say **man thats's ugly** and I will agree. So let's see how build systems will help us with that.

## Compile a simple fortran code III (CMake)

Another way to build a ' Makefiles'  is to use a build system. We are using [CMake](https://cmake.org/).

>CMake is an open-source, cross-platform family of tools designed to build, test and package software. CMake is used to control the software compilation process using simple platform and compiler independent configuration files, and generate native makefiles and workspaces that can be used in the compiler environment of your choice. The suite of CMake tools were created by Kitware in response to the need for a powerful, cross-platform build environment for open-source projects such as ITK and VTK.

First we have to include some `CMakeLists.txt` to or file structure

```bash
project_dir
├── CMakeList.txt -------> (1)
├── src
|    ├── CMakeList.txt --> (2)
|    ├── main.f90
|    └── do_something.f90
└── build
```

Notice that there are two `CMakeLists.txt` files. The first one contains some basic setups, where the second one is responsible for getting the targets compiled and building all the libraries ect.

The first `CMakeLists.txt` looks like this

```cmake
project (cmake_example Fortran)

cmake_minimum_required (VERSION 2.8)

# make sure that the default build type is "RELEASE"
if (NOT CMAKE_BUILD_TYPE)
  set (CMAKE_BUILD_TYPE RELEASE CACHE STRING
      "Choose the type of build, options are: None Debug Release."
      FORCE)
endif (NOT CMAKE_BUILD_TYPE)

# set this to "ON" if you want to see the full compile and link commands instead of only the shortened ones
set(CMAKE_VERBOSE_MAKEFILE OFF)

# save *.mod files in src/modules directory
set (CMAKE_Fortran_MODULE_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/src/modules CACHE STRING
    "Set module ouptut directory to ${CMAKE_CURRENT_SOURCE_DIR}/src/modules" FORCE)

# save compiled library in src/lib directory
set(LIBRARY_OUTPUT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/src/lib CACHE STRING
    "Set library ouptut directory to ${CMAKE_CURRENT_SOURCE_DIR}/src/lib" FORCE)

# set binary output path
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})


# define compiler flags according to chosen compiler
# can be adapted for youra needs
# if DEBUG type should be chosen call: FC=ifort cmake -DCMAKE_BUILD_TYPE=DEBUG .
if ("${CMAKE_Fortran_COMPILER_ID}" MATCHES "Intel")
    set (CMAKE_Fortran_FLAGS_RELEASE "-warn all -O3" CACHE STRING
        "Set coompiler flags." FORCE)
 set (CMAKE_Fortran_FLAGS_DEBUG   "-O0 -g -traceback -check all -debug all" CACHE STRING
  "Set compiler flags." FORCE)
elseif ("${CMAKE_Fortran_COMPILER_ID}" MATCHES "GNU")
    set (CMAKE_Fortran_FLAGS_RELEASE "-Wall -O3 -ffixed-line-length-none -ffree-line-length-none" CACHE STRING
        "Set coompiler flags." FORCE)
 set (CMAKE_Fortran_FLAGS_DEBUG   "-O0 -g -ffixed-line-length-none -ffree-line-length-none" CACHE STRING
  "Set compiler flags." FORCE)
endif ("${CMAKE_Fortran_COMPILER_ID}" MATCHES "Intel")

add_subdirectory(src)
```

And the second one in the `src/` directory looks like this

```cmake
# set files you want to compile
set (SOURCES
 ${CMAKE_CURRENT_SOURCE_DIR}/do_something.f90
)

# build library files
add_library (my_lib ${SOURCES})

# build main program executable and link all files against it
add_executable (main ${CMAKE_CURRENT_SOURCE_DIR}/main.f90)
target_link_libraries (main my_lib)
```

Now you will think thats much more complicated then compiling the source code from the command line. Yes your are right. If you see such build systems for the first time it looks horrible but we will go into the details now and you will see its pretty easy and much more comfortable in the end!

Here is a collection of the [most important CMake variables](https://cmake.org/Wiki/CMake_Useful_Variables).
