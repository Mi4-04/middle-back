import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const hashPassword = async (
  plaintextPassword: string,
): Promise<string> => {
  return await bcrypt.hash(plaintextPassword, saltOrRounds);
};
