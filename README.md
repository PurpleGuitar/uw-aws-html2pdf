uw-aws-html2pdf
===============

This is an experimental, work-in-progress AWS converter from HTML to other
formats. It uses Pandoc to do the conversions. It does not yet support PDF
output because a third-party library such as `pdflatex` is needed.

Install and Run
---------------

-   Set up your AWS/APEX project with the correct keys, region, etc.
-   Make sure there's a `test.html` file in the `inbound` folder of the
    `test-cro-html2pdf` bucket
-   `apex deploy`
-   `apex invoke pandoc-test < example_event.json`

This will read `test.html`, invoke Pandoc to convert it, and then output
the result to the `outbound` folder.

Next Steps
----------

-   Add PDF support
    -   This requires `pdflatex` to run, which is not already present on
        the AWS execution context.
    -   There's no easy way to install `pdflatex` on AWS.
    -   It might be possible to compile/install `pdflatex` on an E2
        instance, then copy the executable and shared libraries into this
        function in a similar way to how we have `pandoc` working.

Resources
---------

-   [Run pdflatex on AWS Lambda](http://stackoverflow.com/questions/37219169/how-to-run-binary-like-pdflatex-on-aws-lambda)
-   [Lambda Execution Contexts](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)
-   [Amazon Machine Images](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
-   [Pandoc For AWS Lambda](https://www.npmjs.com/package/pandoc-aws-lambda-binary)
-   [Compiling Software on E2](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/compile-software.html)
