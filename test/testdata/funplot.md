# Function Plot

## Sample 1

```function-plot
width: 320
height: 200
data:
- fn: 'x^2'
  graphType: 'polyline'
xAxis:
  label: 'x - axis'
  domain: [-6, 6]
yAxis:
  label: 'y - axis'
```

## Sample 2

```function-plot
data:
- fn: 'sqrt(3x+1)'
- fn: '(x^2-1)/3'
  range: [-.3, .inf]
- fn: 'x'
  color: gray
  nSamples: 64
  graphType: 'scatter'
xAxis:
  label: 'x'
  domain: [-1, 8]
yAxis:
  label: 'y'
  domain: [-2, 12]
grid: true
```

## Sample 3

```function-plot
data:
- fn: '(x-1)^3'
- fn: 'nthRoot(x,3)-1'
xAxis:
  label: 'x'
  domain: [-2, 4]
yAxis:
  label: 'y'
  domain: [-6, 6]
grid: true
```

## Sample 4

```function-plot
grid: true
data:
- fn: '3x^2 - 4x + 8'
  graphType: 'polyline'
  range: [-1, 2]
  closed: true
xAxis:
  label: 'x - axis'
  domain: [-3, 3]
yAxis:
  label: 'y - axis'
  domain: [-2, 16]
```

## Sample 5

```function-plot
grid: true
data:
- fn: 'sqrt(4 - x^2)'
  closed: true
  color: 'yellow'
- fn: '-sqrt(8 - x^2) + 2'
  range: [-2, 2]
  closed: true
  color: 'orange'
- points:
  - [-2, 0]
  - [0, 2]
  - [2, 0]
  fnType: 'points'
  graphType: 'polyline'
  color: 'red'
- r: 'sqrt(4)'
  fnType: 'polar'
  graphType: 'polyline'
  color: 'blue'
- x: 'cos(t)*sqrt(8)'
  y: 'sin(t)*sqrt(8) + 2'
  fnType: 'parametric'
  graphType: 'polyline'
  color: 'green'
xAxis:
  label: 'x - axis'
  domain: [-5.5, 5.5]
yAxis:
  label: 'y - axis'
  domain: [-2.25, 5]
```

## Sample 6

```function-plot
grid: true
data:
- fn: 'x^2'
  graphType: 'polyline'
- r: 'cos(theta) / sin(theta)^2'
  fnType: 'polar'
  graphType: 'polyline'
xAxis:
  label: 'x - axis'
  domain: [-2.25, 2.25]
yAxis:
  label: 'y - axis'
  domain: [-1, 2]
```

## Sample 7

```function-plot
grid: true
data:
- r: '(a*b)/sqrt((b * cos(theta))^2 + (a * sin(theta))^2)'
  scope:
    a: 1
    b: 3
  fnType: 'polar'
  graphType: 'polyline'
  closed: true
xAxis:
  label: 'x - axis'
yAxis:
  label: 'y - axis'
```

## Sample 8

```function-plot
grid: true
data:
- fn: '2'
- fn: '-2'
- fn: 'x^2 - y^2 - 4'
  fnType: 'implicit'
xAxis:
  label: 'x - axis'
yAxis:
  label: 'y - axis'
```
