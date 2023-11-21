import colors from 'colors';

const validateData = (requiredFields: string[]) => {
  const greenRequiredFields = requiredFields.map(field => colors.green(field)).join(', ');

  console.log(colors.magenta(`validateData(${greenRequiredFields})`));

  return (req: any, res: any, next: any) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
        const errorMessage = `Missing required fields: ${missingFields}`;
        const missingFieldsString = missingFields.map((field) => field.red).join(', ');
        console.log(colors.cyan(`Missing required fields: ${missingFieldsString}`));
        return res.status(400).json({ error: errorMessage });
    }


    next();
  };
};

export default validateData;
