import axios from "axios";

const DATABRICKS_NEW_DATA_INCOMING_JOB_ID = process.env.DATABRICKS_NEW_DATA_INCOMING_JOB_ID

const databricksInstance = axios.create({
    baseURL: process.env.DATABRICKS_INSTANCE_URL,
    headers: {
        Authorization: `Bearer ${process.env.DATABRICKS_AUTH_TOKEN}`
    }
})

export const dbListRunsForAJob = (activeOnly = true, ...params) => databricksInstance.get('/2.1/jobs/runs/list', {
    params: {
        active_only: activeOnly,
        job_id: process.env.DATABRICKS_NEW_DATA_INCOMING_JOB_ID,
        ...params
    }
})

export const runAWorkflow = (jobId: string, params) => databricksInstance.post('/2.1/jobs/run-now', {
    job_id: jobId,
    notebook_params: {
        ...params
    }
})

export const runNewDataIncoming = (params) => runAWorkflow(process.env.DATABRICKS_NEW_DATA_INCOMING_JOB_ID, params)