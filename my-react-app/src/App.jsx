import {useState, useRef, useEffect} from 'react'

export default function App(){
  const [Tasks, setTasks] = useState([]);
  const input = useRef(null);

  useEffect(()=>{
    const savedTasks = localStorage.getItem('tasks');
    if(savedTasks){
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  function addTask(){
    const task = input.current.value;
    if(task.trim()){
      setTasks([...Tasks, {task, completed:false}]);
      input.current.value = '';
      input.current.focus();
    }
  }

  function toggleCompleted(index){
    setTasks(Tasks.map((t,i) => i === index ? {...t, completed: !t.completed} : t));
  }

  const completedTasks = Tasks.filter(t => t.completed).length;

  function editTask(index){
    const taskToEdit = Tasks[index];
    input.current.value = taskToEdit.task;
    input.current.focus();
    setTasks(Tasks.filter((_, i) => i !== index));
  }

  function handleKeyPress(e){
    if(e.key === 'Enter'){
      addTask();
    }
  }

  useEffect(()=>{
    localStorage.setItem('tasks', JSON.stringify(Tasks));
  }, [Tasks])

  return(
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-semibold mb-8">Tasks</h1>
      
      <div className="flex gap-2 mb-8">
        <input 
          type="text" 
          className="flex-1 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black" 
          ref={input}  
          placeholder="Add a task"
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {Tasks.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{Tasks.length} tasks</span>
            <span>{completedTasks} completed</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all rounded-full duration-300"
              style={{width: `${(completedTasks / Tasks.length) * 100}%`}}
            />
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {Tasks.map((task, index)=> (
          <li 
            key={index}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors group"
          > 
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleCompleted(index)}
              className="w-4 h-4 cursor-pointer"
            />
            
            <p className={`flex-1 my-0  ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.task}
            </p>
            
            <button 
              onClick={() => editTask(index)}
              className="bg-gray-200 text-black hover:bg-gray-200 px-3 py-1 text-sm"
            >
              Edit
            </button>
            
            <button 
              onClick={() => setTasks(Tasks.filter((t,i) => i !== index))}
              className="bg-gray-200 text-black hover:bg-gray-200 px-3 py-1 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {Tasks.length === 0 && (
        <p className="text-center text-gray-400 py-8 my-0">No tasks yet</p>
      )}
    </div>
  )
}