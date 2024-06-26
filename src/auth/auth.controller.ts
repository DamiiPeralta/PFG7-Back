import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  InternalServerErrorException,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CredentialsDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/credentials/credentials.dto';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);
  @Post('signup')
  @ApiOperation({
    summary: 'Create a new user.',
    description:
      'Expects all of the properties of the user through the Body. Returns the created User object.',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.signUp(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        this.logger.error(
          `External request error: ${error.response.data.message}`,
        );
        throw new InternalServerErrorException('Internal server error.');
      } else {
        this.logger.error(`Error no manejado: ${error.message}`);
        throw new InternalServerErrorException('Internal server error.');
      }
    }
  }
  @Post('signin')
  @ApiOperation({
    summary: 'Logs in an existing user to create Token.',
    description:
      'Expects the credentials of the user, email and password, through the Body. Returns a status message, the token and the User object.',
  })
  async signIn(@Body() credentialsDto: CredentialsDto) {
    try {
      const token = await this.authService.signIn(credentialsDto);
      return { token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        this.logger.error(
          `External request error: ${error.response.data.message}`,
        );
        throw new InternalServerErrorException('Internal server error.');
      } else {
        this.logger.error(`Error no manejado: ${error.message}`);
        throw new InternalServerErrorException('Internal server error.');
      }
    }
  }

  @Put('changePassword')
  @ApiOperation({
    summary: 'Changes the user´s password.',
    description:
      'Expects the email, current password and new password of the user through the Body. Returns a status message.',
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      return await this.authService.changePassword(changePasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('forgotPassword')
  @ApiOperation({
    summary: 'Sends an email with a link to reset the password.',
    description: 'Expects user email. Returns a status message.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Put('resetPassword/:rToken')
  @ApiOperation({
    summary: 'Resets the password.',
    description:
      'Accesible only from authorized link. Expects the reset token sent through email to the user and the new password through body. Returns a status message.',
  })
  async resetPassword(
    @Param('rToken') rToken: string,
    @Body() body: ResetPasswordDto,
  ) {
    try {
      const { newPassword } = body;
      return await this.authService.resetPassword(newPassword, rToken);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
