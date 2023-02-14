import { TestBed } from '@angular/core/testing';

import { S3UploadService } from './s3.service';

describe('S3UploadService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: S3UploadService = TestBed.get(S3UploadService);
        expect(service).toBeTruthy();
    });
});
