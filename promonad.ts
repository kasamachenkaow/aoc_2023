import FTask from 'fp-ts/Task'

// FTask.to

// export function* flatten<T>(promise: Promise<T>): Generator<T> {
//   promise.then(x => {
//     yield x
//   });
// }

// const main = () => {
//   const x = flatten(Promise.resolve(1));
//   const y = x.next().value;
//   console.log(y)
// }


const p = Promise.reject(1)
p.catch(x => {
  console.log('catch 1', x)
  return x;
})

p.then(x => {
  console.log('then 1', x)
  throw 'new error';
}).catch(x => {
  console.log('catch 2', x)
  return x;
})

const p2 = Promise.resolve('p2')
p2.catch(console.log).then(console.log)
