const form=document.getElementById('task-form');
const input=document.getElementById('task-input');
const list=document.getElementById('task-list');
const empty=document.getElementById('empty');
const count=document.getElementById('task-count');
const filters=document.querySelectorAll('.filter');
let tasks=JSON.parse(localStorage.getItem('taskflow-tasks')||'[]');
let currentFilter='all';
const today=new Date();
document.getElementById('today').textContent=today.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
function save(){localStorage.setItem('taskflow-tasks',JSON.stringify(tasks));}
function render(){
 list.innerHTML='';
 const visible=tasks.filter(t=>currentFilter==='all'||(currentFilter==='active'&&!t.completed)||(currentFilter==='completed'&&t.completed));
 visible.forEach(task=>{
  const li=document.createElement('li');li.className='task'+(task.completed?' completed':'');
  const check=document.createElement('input');check.type='checkbox';check.className='task-check';check.checked=task.completed;check.setAttribute('aria-label','Mark task complete');
  check.addEventListener('change',()=>{task.completed=check.checked;save();render();});
  const text=document.createElement('span');text.className='task-text';text.textContent=task.text;
  const del=document.createElement('button');del.className='delete';del.textContent='×';del.setAttribute('aria-label','Delete task');del.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==task.id);save();render();});
  li.append(check,text,del);list.append(li);
 });
 empty.classList.toggle('hidden',visible.length>0);
 const remaining=tasks.filter(t=>!t.completed).length;count.textContent=`${remaining} ${remaining===1?'task':'tasks'} left`;
}
form.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim();if(!value)return;tasks.unshift({id:Date.now(),text:value,completed:false});input.value='';save();render();input.focus();});
filters.forEach(btn=>btn.addEventListener('click',()=>{currentFilter=btn.dataset.filter;filters.forEach(b=>b.classList.toggle('active',b===btn));render();}));
document.getElementById('clear-completed').addEventListener('click',()=>{tasks=tasks.filter(t=>!t.completed);save();render();});
render();
