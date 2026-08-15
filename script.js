// Base de datos local
let studyData = JSON.parse(localStorage.getItem('studyData')) || [];
let currentSubjectId = null;

// Referencias del DOM
const subjectInput = document.getElementById('subject-input');
const addSubjectBtn = document.getElementById('add-subject-btn');
const subjectsList = document.getElementById('subjects-list');
const welcomeMessage = document.getElementById('welcome-message');
const subjectWorkspace = document.getElementById('subject-workspace');
const currentSubjectTitle = document.getElementById('current-subject-title');
const topicInput = document.getElementById('topic-input');
const addTopicBtn = document.getElementById('add-topic-btn');
const topicsContainer = document.getElementById('topics-container');

// Inicializar la app
function init() {
    renderSubjects();
}

// Guardar en LocalStorage
function saveData() {
    localStorage.setItem('studyData', JSON.stringify(studyData));
}

// Agregar Materia
addSubjectBtn.addEventListener('click', () => {
    const name = subjectInput.value.trim();
    if (name) {
        const newSubject = {
            id: Date.now().toString(),
            name: name,
            topics: []
        };
        studyData.push(newSubject);
        saveData();
        subjectInput.value = '';
        renderSubjects();
    }
});

// Renderizar lista de materias
function renderSubjects() {
    subjectsList.innerHTML = '';
    studyData.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = subject.name;
        
        // Resaltar la materia seleccionada
        if (subject.id === currentSubjectId) li.classList.add('active');

        // Botón eliminar materia
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            if(confirm(`¿Eliminar la materia ${subject.name}?`)) {
                studyData = studyData.filter(s => s.id !== subject.id);
                if(currentSubjectId === subject.id) {
                    currentSubjectId = null;
                    welcomeMessage.classList.remove('hidden');
                    subjectWorkspace.classList.add('hidden');
                }
                saveData();
                renderSubjects();
            }
        };

        li.appendChild(deleteBtn);
        
        li.addEventListener('click', () => {
            currentSubjectId = subject.id;
            renderSubjects(); // Para actualizar clases activas
            openSubject(subject);
        });

        subjectsList.appendChild(li);
    });
}

// Abrir el área de trabajo de una materia
function openSubject(subject) {
    welcomeMessage.classList.add('hidden');
    subjectWorkspace.classList.remove('hidden');
    currentSubjectTitle.textContent = subject.name;
    renderTopics(subject);
}

// Agregar Tema
addTopicBtn.addEventListener('click', () => {
    const title = topicInput.value.trim();
    if (title && currentSubjectId) {
        const subjectIndex = studyData.findIndex(s => s.id === currentSubjectId);
        studyData[subjectIndex].topics.push({
            id: Date.now().toString(),
            title: title,
            q1: '', // ¿Qué viste?
            q2: '', // ¿Qué te llamó más la atención?
            q3: ''  // ¿Qué fue lo que más recordaste?
        });
        saveData();
        topicInput.value = '';
        openSubject(studyData[subjectIndex]);
    }
});

// Renderizar temas de la materia actual
function renderTopics(subject) {
    topicsContainer.innerHTML = '';
    
    subject.topics.forEach(topic => {
        const details = document.createElement('details');
        
        const summary = document.createElement('summary');
        summary.innerHTML = `<span>${topic.title}</span>`;
        
        // Área del Filtro de Preguntas
        const formDiv = document.createElement('div');
        formDiv.className = 'reflection-form';

        const questions = [
            { key: 'q1', label: '👀 ¿Qué viste en este tema?' },
            { key: 'q2', label: '✨ ¿Qué te llamó más la atención?' },
            { key: 'q3', label: '🧠 ¿Qué fue lo que más recordaste?' }
        ];

        questions.forEach(q => {
            const qBlock = document.createElement('div');
            qBlock.className = 'question-block';
            
            const label = document.createElement('label');
            label.textContent = q.label;
            
            const textarea = document.createElement('textarea');
            textarea.placeholder = "Escribe tus apuntes aquí...";
            textarea.value = topic[q.key];
            
            // Autoguardado al escribir
            textarea.addEventListener('input', (e) => {
                topic[q.key] = e.target.value;
                saveData();
            });

            qBlock.appendChild(label);
            qBlock.appendChild(textarea);
            formDiv.appendChild(qBlock);
        });

        details.appendChild(summary);
        details.appendChild(formDiv);
        topicsContainer.appendChild(details);
    });
}

// Arrancar la app
init();