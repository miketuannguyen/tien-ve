import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Response } from 'express';
import { CreateMessageDTO, MessageDTO } from 'src/dtos';
import { BaseController } from 'src/includes';
import { APIListResponse, APIResponse, CONSTANTS, Helpers, MESSAGES } from 'src/utils';
import { CommonSearchQuery } from 'src/utils/types';
import ROUTES from '../routes';
import { MessageService } from './message.service';

@Controller(ROUTES.MESSAGE.MODULE)
export class MessageController extends BaseController {
    /** Constructor */
    constructor(private readonly _messageService: MessageService) {
        super();
    }

    @Post(ROUTES.MESSAGE.CREATE)
    public async create(@Res() res: Response<APIResponse<MessageDTO | null>>, @Body() body: CreateMessageDTO) {
        try {
            const message = new MessageDTO();
            message.address = body.address || '';
            message.phone = body.phone || '';
            message.body = body.body || '';
            message.send_date = dayjs(Number(body.send_date) || 0).format(CONSTANTS.MYSQL_DATETIME_FORMAT);
            message.receive_date = dayjs(Number(body.receive_date) || 0).format(CONSTANTS.MYSQL_DATETIME_FORMAT);

            const result = await this._messageService.create(message);
            if (Helpers.isEmptyObject(result)) {
                const errRes = APIResponse.error<null>(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
            }

            const successRes = APIResponse.success<MessageDTO | null>(MESSAGES.SUCCESS.SUCCESS, result);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.create.name, e);
            const errRes = APIResponse.error(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }

    @Get(ROUTES.MESSAGE.LIST)
    public async getList(@Res() res: Response<APIListResponse<MessageDTO>>, @Query() query: CommonSearchQuery) {
        try {
            const total = await this._messageService.getTotal();
            let list: MessageDTO[] = [];
            if (total > 0) {
                list = await this._messageService.getList(query);
                if (!Helpers.isFilledArray(list)) {
                    const errRes = APIListResponse.error<MessageDTO>(MESSAGES.ERROR.ERR_NO_DATA);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
                }
            }

            const successRes = APIListResponse.success<MessageDTO>(MESSAGES.SUCCESS.SUCCESS, list, total);
            return res.status(HttpStatus.OK).json(successRes);
        } catch (e) {
            this._logger.error(this.getList.name, e);
            const errRes = APIListResponse.error<MessageDTO>(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errRes);
        }
    }
}
