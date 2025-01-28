import { ValidationArguments } from 'class-validator';

export const lenghtValidationMessage = (args: ValidationArguments) => {
  if (args.value.length === 2) {
    return `${args.property} 은 ${args.constraints[0]}자 이상 ${args.constraints[1]}자 이하여야 합니다.`;
  }

  return `최소 ${args.constraints[0]}자 이상이어야 합니다.`;
};
