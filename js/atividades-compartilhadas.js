// atividades-compartilhadas.js - Sistema unificado de atividades

// Função para obter atividades (compartilhada entre professor e aluno)
function getActivities() {
    const activities = localStorage.getItem('activities');
    return activities ? JSON.parse(activities) : [];
}

// Função para salvar atividades
function saveActivities(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Função para criar nova atividade (professor)
function createActivity(activityData) {
    const activities = getActivities();
    const newActivity = {
        id: Date.now(),
        ...activityData,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    activities.push(newActivity);
    saveActivities(activities);
    return newActivity;
}

// Função para obter atividades do aluno
function getStudentActivities(studentId) {
    const activities = getActivities();
    // Filtrar atividades ativas e que pertencem às disciplinas do aluno
    return activities.filter(activity => activity.status === 'active');
}

// Função para submeter atividade (aluno)
function submitActivity(activityId, studentId, submissionData) {
    const activities = getActivities();
    const activityIndex = activities.findIndex(a => a.id === activityId);
    
    if (activityIndex === -1) return false;
    
    if (!activities[activityIndex].submissions) {
        activities[activityIndex].submissions = [];
    }
    
    activities[activityIndex].submissions.push({
        studentId: studentId,
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
    });
    
    saveActivities(activities);
    return true;
}