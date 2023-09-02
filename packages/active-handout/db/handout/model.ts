import { Exercise } from "../exercise/model";

export class Handout {
  uri: string;
  exercises: Exercise[];

  static fromJSON(json: any) {
    const exercisesJSON = json.exercises ? Object.values(json.exercises) : [];
    return new Handout(json.uri, exercisesJSON.map(Exercise.fromJSON));
  }

  constructor(uri: string, exercises: Exercise[]) {
    this.uri = uri;
    this.exercises = exercises;
  }

  toString() {
    return this.uri;
  }

  toJSON() {
    return {
      uri: this.uri,
      exercises: this.exercises?.map((exercise) => exercise.toJSON()),
    };
  }
}
