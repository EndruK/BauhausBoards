#!/bin/bash
function compile() {
  file=$1
  filename="${file%.*}"

  pdflatex $file
  bibtex $filename
  pdflatex $file
  pdflatex $file

  rm -f *.toc *.aux *.log *.out *.brf *.blg *.bbl
  #for f in * ; do
  #  filename="${f%.*}"
  #  extension="${f##*.}"
  #  if [[ ( ( ! -d $f ) && ( $extension != "tex") && ( $extension != "zip") && ( $extension != "pdf" ) && ( $extension != "bib" ) && ( $extension != "cls" ) && ( $extension != "png" ) && ( $extension != "jpg" ) && ( $extension != "sh" ) && ( $extension != "bst" ) ) ]] ; then
  #    #echo "$filename   $extension"
  #    rm $f
  #  fi
  #done
}

compile thesis.tex