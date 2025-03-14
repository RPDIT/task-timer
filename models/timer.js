// task timer 
// create a tool that logs the start time of a task, the end time of the task, and provides details about how long the task took at the end. 
// This data should be stored, observable, and navigable. 
// When starting a new task, it should be possible to add a name/description of the task. 
// storage options: SQL db, xml flie, or csv file. 
//

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        default: ""
    },
    start_time: {
        type: Date, 
        required: false
    },
    end_time: {
        type: Date, 
        required: false
    }, 
    timer_active: {
        type: Boolean, 
        required: true, 
        default: false
    },
    task_complete: {
        type: Boolean, 
        required: true, 
        default: false
    },
    duration: {
        type: Number, 
        required: false
    },
    duration_seconds: {
        type: Number, 
        required: false
    }, 
    completed_tasks: {
        type: Array,
        required: true, 
        default: []
    }
    });
taskSchema.methods.startTimer = async function startTimer() {
    if (this.timer_active == true) { return 'timer already started'} else {
        this.start_time = Date.now(); 
        console.log("Started task at: " + this.start_time);
        this.timer_active = true;
        this.task_complete = false;
        return await this.save()
}}; 
taskSchema.methods.addName = async function addName(task_name) {
    this.name = task_name;    
    return await this.save()
};
taskSchema.methods.checkDuration = function checkDuration() {
   if (this.task_complete == true &&  this.timer_active == false) {
       console.log("Task Started at: " + this.start_time + " and Ended at: " + this.end_time);
        this.duration = (Date.parse(this.end_time)) - (Date.parse(this.start_time));
        console.log(this.duration);  
        this.duration_seconds = Math.floor(this.duration / (1000))
        const output_words = `This task took ${this.duration_seconds}s`
        console.log(output_words);
        return this
        
   } else return 'task is not complete';
}
taskSchema.methods.endTimer = async function endTimer() {
    if (this.timer_active = true) {
        this.end_time = Date.now();
        this.timer_active = false;
        this.task_complete = true;
        this.checkDuration();
        this.recordCompletedTask();
        this.clearCurrentTask();
        return await this.save();
    } else return 'timer is not active';
};
taskSchema.methods.recordCompletedTask = function recordCompletedTask() {
    const logObject = {
        start: this.start_time,
        end: this.end_time, 
        duration_seconds: this.duration_seconds
    };
    this.completed_tasks.push(logObject);
    return this
}
taskSchema.methods.clearCurrentTask = function clearCurrentTask() {
    this.start_time = null;
    this.end_time = null;
    this.task_complete = false;
    this.timer_active = false;
    this.duration = null;
    this.duration_seconds = null;
    return this
};

const TimedTask = mongoose.model('Task', taskSchema);

export default TimedTask;
