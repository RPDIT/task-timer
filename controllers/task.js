import express from 'express';

import TaskModel from '../models/timer.js';

const newTask = async (req, res) => {
   res.json(await createTask(`${req.params.name}`));
}; 

const getAllTasks = async (req, res) => {
    res.status(200).json(await allTasks().catch(e => {e}));
}

const getTaskById = async (req, res) => {
    res.status(200).json(await taskById(req.params.id).catch(e => {e}));
};

const startTimedTask = async (req, res) => {
    res.status(200).json(await startTask(req.params.id).catch(e => {e}))
};

const endTimedTask = async (req, res) => {
    res.status(200).json(await endTask(req.params.id).catch(e => {e}));
};

async function createTask(task_name) {
    const thisTask = new TaskModel();
    return await thisTask.addName(task_name);
};

async function allTasks() {
    return await TaskModel.find();
}

async function taskById(task_id) {
    return await TaskModel.findById(task_id)
};

async function startTask(task_id) {
    console.log('starting');
    const this_task = await taskById(task_id);
    return this_task.startTimer();
};

async function endTask(task_id) {
    const this_task = await taskById(task_id);
    return this_task.endTimer();
};
export default {newTask, getAllTasks, getTaskById, startTimedTask, endTimedTask};
