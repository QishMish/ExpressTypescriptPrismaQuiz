export class Helper {
    public exclude<IQuestion, Key extends keyof IQuestion>(
        question: IQuestion,
        ...keys: Key[]
      ): Omit<IQuestion, Key> {
        for (let key of keys) {
          delete question[key]
        }
        return question
      }
} 

export default new Helper()
