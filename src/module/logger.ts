import { utilities, WinstonModule } from "nest-winston";
import { LoggerService } from '@nestjs/common';
import * as winstonDaliy from 'winston-daily-rotate-file';
import * as winston from "winston";

interface DailiyOption{
    level: string,
    datePattern: string,
    dirname: string,
    filename: string,
    maxFiles: number,
    zippedArchive: boolean
}

export class Logger {
    private env: string = process.env.NODE_ENV;
    private dir: string = __dirname + '/../../logs';
    private appName: string = "";

    public constructor(appName: string) {
        this.appName = appName;
    }

    private getDailiyOptions(level: string): DailiyOption {
        return {
            level,
            datePattern: 'YYYY-MM-DD',
            dirname: this.dir + `/${level}`,
            filename: `%DATE%.${level}.log`,
            maxFiles: 30,
            zippedArchive: true,
        }
    }

    public getLogger() {
        return WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    level: this.env === 'production' ? 'http' : 'silly',
                    format: this.env === 'production'
                            ? winston.format.simple()
                            : winston.format.combine(
                                winston.format.timestamp(),
                                utilities.format.nestLike(this.appName, {
                                    prettyPrint: true
                                }),
                            ),
                }),

                new winstonDaliy(this.getDailiyOptions('info')),
                new winstonDaliy(this.getDailiyOptions('warn')),
                new winstonDaliy(this.getDailiyOptions('error')),
            ]
        })
    }

}