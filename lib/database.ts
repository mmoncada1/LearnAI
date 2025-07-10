import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { User, UserProgress, LearningPath } from '@/types';

const DATA_DIR = join(process.cwd(), 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const PROGRESS_FILE = join(DATA_DIR, 'progress.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  const fs = require('fs');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!existsSync(USERS_FILE)) {
  writeFileSync(USERS_FILE, '[]');
}

if (!existsSync(PROGRESS_FILE)) {
  writeFileSync(PROGRESS_FILE, '[]');
}

export function getUsers(): User[] {
  try {
    const data = readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

export function saveUser(user: User): void {
  try {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Failed to save user');
  }
}

export function getUserByEmail(email: string): User | null {
  try {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export function getUserById(id: string): User | null {
  try {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

export function getAllProgress(): UserProgress[] {
  try {
    const data = readFileSync(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading progress file:', error);
    return [];
  }
}

export function getUserProgress(userId: string): UserProgress | null {
  try {
    const allProgress = getAllProgress();
    return allProgress.find(p => p.userId === userId) || null;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    const allProgress = getAllProgress();
    const existingIndex = allProgress.findIndex(p => p.userId === progress.userId);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    writeFileSync(PROGRESS_FILE, JSON.stringify(allProgress, null, 2));
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw new Error('Failed to save progress');
  }
}

export function addLearningPathToUser(userId: string, learningPath: LearningPath): void {
  try {
    let progress = getUserProgress(userId);
    
    if (!progress) {
      progress = {
        userId,
        learningPaths: [],
        completedResources: [],
        totalHoursSpent: 0,
        skillsLearned: [],
        streakDays: 0,
        lastActivityAt: new Date().toISOString()
      };
    }
    
    // Add ID and metadata to learning path
    const pathWithId = {
      ...learningPath,
      id: `${userId}-${Date.now()}`,
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      isActive: true,
      progress: 0
    };
    
    progress.learningPaths.push(pathWithId);
    progress.lastActivityAt = new Date().toISOString();
    
    saveUserProgress(progress);
  } catch (error) {
    console.error('Error adding learning path to user:', error);
    throw new Error('Failed to add learning path');
  }
}

export function updateLearningPathProgress(userId: string, pathId: string, stageIndex: number, resourceIndex: number, completed: boolean): void {
  try {
    const progress = getUserProgress(userId);
    if (!progress) throw new Error('User progress not found');
    
    const pathIndex = progress.learningPaths.findIndex(p => p.id === pathId);
    if (pathIndex === -1) throw new Error('Learning path not found');
    
    const path = progress.learningPaths[pathIndex];
    
    // Update resource completion
    if (path.stages[stageIndex] && path.stages[stageIndex].resources[resourceIndex]) {
      path.stages[stageIndex].resources[resourceIndex].completed = completed;
      
      // Update resource in completed list
      const resourceId = `${pathId}-${stageIndex}-${resourceIndex}`;
      if (completed) {
        if (!progress.completedResources.includes(resourceId)) {
          progress.completedResources.push(resourceId);
        }
      } else {
        progress.completedResources = progress.completedResources.filter(id => id !== resourceId);
      }
    }
    
    // Calculate overall progress
    const totalResources = path.stages.reduce((acc, stage) => acc + stage.resources.length, 0);
    const completedResources = path.stages.reduce((acc, stage) => 
      acc + stage.resources.filter(r => r.completed).length, 0);
    
    path.progress = Math.round((completedResources / totalResources) * 100);
    path.lastAccessedAt = new Date().toISOString();
    
    // Check if stage is completed
    const stageCompleted = path.stages[stageIndex].resources.every(r => r.completed);
    path.stages[stageIndex].completed = stageCompleted;
    
    progress.lastActivityAt = new Date().toISOString();
    saveUserProgress(progress);
  } catch (error) {
    console.error('Error updating learning path progress:', error);
    throw new Error('Failed to update progress');
  }
}
