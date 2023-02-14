import { Injectable, EventEmitter } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as uuid from 'uuid';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class S3UploadService {

    public progress: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    uploadfile(file) {
        let fileExtension, filename: string;
        const uniquename = uuid.v4();
        fileExtension = file.name.replace(/^.*\./, '');
        console.log(fileExtension);
        filename = 'file/' + uniquename + '.' + fileExtension;
        AWS.config.update({
            region: 'us-west-2',
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-west-2:24156852-9a85-4b7d-8846-b5f44dd05590'
            })
        });

        const S3Client = new S3();
        let params: any = {};
        params = {
            Bucket: 'businessin-dev',
            Key: filename,
            Body: file,
            ACL: 'public-read',
            ContentType: file.type
        };

        return new Promise((res, rej) => {
            S3Client.upload(params, function (err: any, data: any) {
                if (err) {
                    console.log(err);
                    return rej(err);
                }

                return res(data);

            })
                .on('httpUploadProgress', (event) => { // change here
                    const progress = Math.round((event.loaded / event.total) * 100);
                    this.progress.emit(progress);
                });

        });



    }

    compress(file: File): Observable<any> {
        const width = 1280; // For scaling relative to width
        const height = 525;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return Observable.create(observer => {
            reader.onload = ev => {
                const img = new Image();
                img.src = (ev.target as any).result;
                (img.onload = () => {
                    const elem = document.createElement('canvas');
                    if (img.width >= width && img.height >= height) {
                        elem.width = width;
                        elem.height = height;
                        const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        observer.next({ error: false, image: ctx.canvas.toDataURL() });
                    } else {
                        observer.next({ error: true });
                    }


                }),
                    (reader.onerror = error => observer.error(error));
            };
        });
    }
}
