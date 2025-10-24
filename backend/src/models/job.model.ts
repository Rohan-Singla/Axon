import { client } from "../db/config";

export interface Job {
  job_uuid?: string; 
  template_id: string;
  difficulty: string;
  created_at?: string;
}

export class JobModel {
  // static async insertMany(jobs: Job[]) {
  //   await client.insert({
  //     table: "jobs",
  //     values: jobs,
  //     format: "JSONEachRow",
  //   });
  // }
  static async insertMany(jobs: Job[]) {
    // Temporary test: insert each job individually in a loop
    for (const job of jobs) {
      await client.insert({
        table: "jobs",
        values: [job], // insert one row at a time
        format: "JSONEachRow",
      });
      console.log("Inserted job:", job);
    }
  }
  
  static async findById(job_uuid: string): Promise<Job | null> {
    const resultSet = await client.query({
      query: "SELECT * FROM jobs WHERE job_uuid = {job_uuid:UUID} LIMIT 1",
      query_params: { job_uuid },
      format: "JSONEachRow",
    });

    const rows = await resultSet.json<Job>();
    return rows.length ? rows[0]! : null;
  }
}
