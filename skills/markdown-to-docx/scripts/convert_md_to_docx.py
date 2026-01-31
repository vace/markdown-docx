#!/usr/bin/env python3
"""
Convert Markdown files to DOCX format using markdown-docx npm package.
Supports single file and batch conversion.
"""

import argparse
import subprocess
import sys
from pathlib import Path


def check_npx_available():
    """Check if npx is available in the system."""
    try:
        subprocess.run(
            ["npx", "--version"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def convert_markdown_to_docx(input_file, output_file=None):
    """
    Convert a single markdown file to DOCX.

    Args:
        input_file: Path to input markdown file
        output_file: Path to output DOCX file (optional, auto-generated if not provided)

    Returns:
        tuple: (success: bool, output_path: str, error_message: str)
    """
    input_path = Path(input_file)

    # Validate input file
    if not input_path.exists():
        return False, None, f"Input file does not exist: {input_file}"

    if not input_path.is_file():
        return False, None, f"Input path is not a file: {input_file}"

    if input_path.suffix.lower() not in [".md", ".markdown"]:
        return False, None, f"Input file is not a markdown file: {input_file}"

    # Determine output file
    if output_file is None:
        output_path = input_path.with_suffix(".docx")
    else:
        output_path = Path(output_file)

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Run conversion
    try:
        result = subprocess.run(
            [
                "npx",
                "markdown-docx",
                "-i",
                str(input_path),
                "-o",
                str(output_path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        return True, str(output_path), None
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr if e.stderr else str(e)
        return False, None, f"Conversion failed: {error_msg}"


def convert_batch(input_files, output_dir=None):
    """
    Convert multiple markdown files to DOCX.

    Args:
        input_files: List of input markdown file paths
        output_dir: Directory for output files (optional, uses input file locations if not provided)

    Returns:
        dict: Results with 'success', 'failed', and 'results' keys
    """
    results = []
    success_count = 0
    failed_count = 0

    for input_file in input_files:
        input_path = Path(input_file)

        # Determine output path
        if output_dir:
            output_path = Path(output_dir) / input_path.with_suffix(".docx").name
        else:
            output_path = None  # Auto-generate in same directory as input

        success, output, error = convert_markdown_to_docx(input_file, output_path)

        results.append({
            "input": input_file,
            "output": output,
            "success": success,
            "error": error,
        })

        if success:
            success_count += 1
        else:
            failed_count += 1

    return {
        "success": success_count,
        "failed": failed_count,
        "results": results,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Convert Markdown files to DOCX format using markdown-docx"
    )
    parser.add_argument(
        "-i",
        "--input",
        nargs="+",
        required=True,
        help="Input markdown file(s)",
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Output DOCX file (single file mode) or directory (batch mode)",
    )

    args = parser.parse_args()

    # Check if npx is available
    if not check_npx_available():
        print("Error: npx is not available. Please install Node.js and npm.", file=sys.stderr)
        sys.exit(1)

    # Single file conversion
    if len(args.input) == 1:
        success, output, error = convert_markdown_to_docx(args.input[0], args.output)

        if success:
            print(f"✅ Conversion successful: {output}")
            sys.exit(0)
        else:
            print(f"❌ Conversion failed: {error}", file=sys.stderr)
            sys.exit(1)

    # Batch conversion
    else:
        if args.output and not Path(args.output).is_dir():
            # Create output directory if it doesn't exist
            Path(args.output).mkdir(parents=True, exist_ok=True)

        batch_results = convert_batch(args.input, args.output)

        print(f"\n📊 Batch Conversion Results:")
        print(f"   ✅ Successful: {batch_results['success']}")
        print(f"   ❌ Failed: {batch_results['failed']}")
        print()

        for result in batch_results["results"]:
            if result["success"]:
                print(f"✅ {result['input']} → {result['output']}")
            else:
                print(f"❌ {result['input']}: {result['error']}")

        sys.exit(0 if batch_results["failed"] == 0 else 1)


if __name__ == "__main__":
    main()
