import { OmitType } from '@nestjs/swagger';

import { RegisterDto } from '../../auth';

export class ManagerDto extends OmitType(RegisterDto, ['isBuyer']) {}
