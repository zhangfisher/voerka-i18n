# Formatters

`@voerkai18n/formatters` provides many built-in formatters.

## Date and Time

### date

Format date.

```ts
date(value:Date | number | string,format:string="long"):string
```

### time

Format time.

```ts
time(value:Date | number | string,format:string="long"):string
```

### quarter

Format quarter.

```ts
quarter(value:number,format:string="long"):string
```

### month

Format month.

```ts
month(value:number,format:string="long"):string
```

### weekday

Format weekday.

```ts
weekday(value:number,format:string="long"):string
```

## Currency

### currency

Format currency.

```ts
currency(value:number,format:string="long"):string
```

## Relative Time

### relativeTime

Format relative time.

```ts
relativeTime(value:Date | number | string):string
```
