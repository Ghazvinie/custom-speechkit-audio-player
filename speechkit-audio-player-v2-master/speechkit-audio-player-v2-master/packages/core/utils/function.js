export const noop = () => {}

export const compose = (...fns) => (
  fns.reduce((f, g) => (...args) => f(g(...args)))
)

export const curry = func => function curried(...args) {
  if (args.length >= func.length) {
    return func.apply(this, args)
  }

  return (...args2) => curried.apply(this, args.concat(args2))
}

export const T = () => true

export const F = () => !T()
