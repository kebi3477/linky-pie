import { Injectable } from '@nestjs/common';
import { Logger } from 'src/module/logger';
import { BlockSeriesRepository } from './block-series.repository';
import { UserRepository } from 'src/user/user.repository';
import { CreateBlockSeriesDTO, UpdateBlockSeriesDTO } from './block-series.dto';
import { BlockSeries } from './block-series.entity';
import { User } from 'src/user/user.entity';
import { UserMessage } from 'src/user/user.message';
import { BlockSeriesMessage } from './block-series.message';

@Injectable()
export class BlockSeriesService {
    private logger = new Logger(BlockSeriesService.name).getLogger();

    constructor(
        private readonly model: BlockSeriesRepository,
        private readonly userModel: UserRepository
    ) {}

    /**
     * 시리즈 생성
     * 
     * @param userId 사용자ID
     * @param CreateBlockSeriesDTO 시리즈 생성 DTO
     * @returns 생성한 시리즈
     */
    public async create(userId: string, createBlockSeriesDTO: CreateBlockSeriesDTO): Promise<BlockSeries> {
        try {
            this.logger.log(`[시리즈 생성] API 호출 [ userId : ${userId} ]`);

            const user: User = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[시리즈 생성] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            createBlockSeriesDTO.user = user;
        
            this.logger.log(`[시리즈 생성] 생성 시작 [ title : ${userId} ] `);
            const newBlockseries: BlockSeries = this.model.create(createBlockSeriesDTO);
            this.logger.log(`[시리즈 생성] 생성 성공 [ id : ${newBlockseries.id} ] `);
            return await this.model.save(newBlockseries);
        } catch (error) {
            this.logger.error(`[시리즈 생성] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 시리즈 조회
     * 
     * @param userId 사용자ID
     * @param seriesId 시리즈ID
     * @returns 조회한 시리즈
     */
    public async read(userId: string, seriesId: string): Promise<BlockSeries> {
        try {
            this.logger.log(`[시리즈 조회] API 호출 [ userId : ${userId}, seriesId : ${seriesId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[시리즈 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const series = await this.model.read(seriesId);
            if (!series) {
                this.logger.log(`[시리즈 조회] 실패 [ seriesId : ${seriesId} ] -> 시리즈를 찾을 수 없음`);
                throw new Error(BlockSeriesMessage.NOT_FOUND);
            }
        
            return series;
        } catch (error) {
            this.logger.error(`[시리즈 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 시리즈 수정
     * 
     * @param userId 사용자ID
     * @param seriesId 시리즈ID
     * @param UpdateBlockseriesDTO 시리즈 수정 DTO
     * @returns 수정한 시리즈
     */
    public async update(userId: string, seriesId: string, updateBlockSeriesDTO: UpdateBlockSeriesDTO): Promise<BlockSeries> {
        try {
            this.logger.log(`[시리즈 수정] API 호출 [ userId : ${userId}, seriesId : ${seriesId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[시리즈 수정] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const series = await this.model.read(seriesId);
            if (!series) {
                this.logger.log(`[시리즈 수정] 실패 [ seriesId : ${seriesId} ] -> 시리즈를 찾을 수 없음`);
                throw new Error(BlockSeriesMessage.NOT_FOUND);
            }

            Object.assign(series, updateBlockSeriesDTO);
            await this.model.save(series);
            this.logger.log(`[시리즈 수정] 성공 [ seriesId : ${seriesId} ] `);
        
            return series;
        } catch (error) {
            this.logger.error(`[시리즈 수정] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 시리즈 삭제
     * 
     * @param userId 사용자ID
     * @param seriesId 시리즈ID
     * @returns 삭제한 시리즈
     */
    public async delete(userId: string, seriesId: string): Promise<BlockSeries> {
        try {
            this.logger.log(`[시리즈 삭제] API 호출 [ userId : ${userId}, seriesId : ${seriesId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[시리즈 삭제] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            const series = await this.model.read(seriesId);
            if (!series) {
                this.logger.log(`[시리즈 삭제] 실패 [ seriesId : ${seriesId} ] -> 시리즈를 찾을 수 없음`);
                throw new Error(BlockSeriesMessage.NOT_FOUND);
            }

            await this.model.delete(seriesId);
            this.logger.log(`[시리즈 삭제] 성공 [ seriesId : ${seriesId} ] `);
        
            return series;
        } catch (error) {
            this.logger.error(`[시리즈 삭제] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }

    /**
     * 사용자 시리즈 목록 조회
     * 
     * @param userId 사용자ID
     * @returns 시리즈 목록
     */
    public async getList(userId: string): Promise<BlockSeries[]> {
        try {
            this.logger.log(`[블록 목록 조회] API 호출 [ userId : ${userId} ]`);

            const user = await this.userModel.read(userId);
            if (!user) {
                this.logger.log(`[블록 목록 조회] 실패 [ userId : ${userId} ] -> 사용자를 찾을 수 없음`);
                throw new Error(UserMessage.NOT_FOUND);
            }

            return await this.model.getSeriesListByUserId(userId);
        } catch (error) {
            this.logger.error(`[블록 목록 조회] 에러! [ error : ${error.message} ] `);
            throw error;
        }
    }
}
