import { client } from "../db/config";

export interface Job {
  job_id: string;
  template_id: string;
  difficulty: string;
  created_at: string;
}

export class JobModel {
  static async insert(job: Job) {

    await client.insert({
      table: 'jobs',
      values: [job],
      format: 'JSONEachRow',
    });
  }

  static async findById(job_id: string): Promise<Job | null> {
    const resultSet = await client.query({
      query: 'SELECT * FROM jobs WHERE job_id = {job_id:String} LIMIT 1',
      query_params: { job_id },
      format: 'JSONEachRow',
    });

    const rows = await resultSet.json<Job>();
    return rows.length ? rows[0] as Job : null;
  }
}
