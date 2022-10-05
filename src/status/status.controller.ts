import { Controller, Get, HttpStatus } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('check')
  check() {
    return HttpStatus.OK;
  }
}
