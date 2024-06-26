import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  // UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './donation.dto';
// import { AdminGuard } from 'src/auth/auth.guard';

@ApiTags('Donation')
@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get()
  // @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get all donations',
    description:
      'Doesn`t expect any parameters. Returns an array of Donation objects.',
  })
  async getAllDonations() {
    try {
      return await this.donationService.getAllDonations();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Gets donations by the user´s ID',
    description:
      'Expects the UUID of the user through Params. Returns an array of Donation objects.',
  })
  async getDonationsByUserId(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.donationService.getDonationsByUserId(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('')
  @ApiOperation({
    summary: 'Creates a new donation',
    description:
      'Expects the ID of the user, the donation amaunt, date creating the team through params and the team data through body. Returns the created Team object.',
  })
  async createDonation(@Body() donationDto: CreateDonationDto) {
    try {
      return await this.donationService.createDonation(donationDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
