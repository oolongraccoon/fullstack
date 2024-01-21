const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ parts }) => {
  let sum = 0;
  sum = parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)
  return <b>total of {sum} exercises</b>
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return(
  parts.map((part) => (
  <Part key={part.id} part={part} />
  ))
  )
}     

const Course = ({ course }) => (
  <div>
    <h1>Web development curriculum</h1>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />

  </div>
)
export default Course
