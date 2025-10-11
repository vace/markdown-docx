# Mathematical Equations Example

This document demonstrates the LaTeX math equation support in markdown-docx.

## Inline Math

You can write inline equations like $E=mc^2$ directly in your text. Here are more examples:

- Einstein's mass-energy equivalence: $E=mc^2$
- Pythagorean theorem: $a^2 + b^2 = c^2$
- Quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
- Greek letters: $\alpha$, $\beta$, $\gamma$, $\delta$, $\pi$, $\omega$

## Block Math

For display equations, use double dollar signs:

$$
E=mc^2
$$

### More Examples

The Pythagorean theorem:

$$
a^2 + b^2 = c^2
$$

Sum of Greek letters:

$$
\alpha + \beta + \gamma = \pi
$$

Inequality:

$$
x \leq y
$$

Mathematical operations:

$$
a \times b \div c \pm d
$$

## Supported Features

Currently supported LaTeX features:

1. **Superscripts**: $x^2$, $e^{10}$
2. **Subscripts**: $x_1$, $a_{10}$
3. **Greek letters**: $\alpha$, $\beta$, $\gamma$, $\delta$, $\epsilon$, $\pi$, $\omega$
4. **Operators**: $\times$, $\div$, $\pm$, $\mp$
5. **Relations**: $\leq$, $\geq$, $\neq$, $\approx$, $\equiv$
6. **Special symbols**: $\infty$, $\in$, $\notin$

## Limitations

This is a basic implementation that converts LaTeX to Unicode text representation. For more complex equations with fractions, matrices, integrals, etc., a more sophisticated LaTeX-to-OMML converter would be needed.

## Future Enhancements

Potential improvements:

- Full LaTeX-to-OMML conversion for complex equations
- Support for fractions, radicals, matrices
- Support for integrals, summations, products
- Support for multi-line equations
- Better handling of nested expressions

