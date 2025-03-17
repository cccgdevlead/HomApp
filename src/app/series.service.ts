// series.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export interface AudioFile {
  url: string;
  title: string;
  duration: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private readonly s3Client: S3Client;
  private readonly bucketName = 'elasticbeanstalk-us-east-2-058264386413';
  private readonly region = 'us-east-2';

  constructor(private http: HttpClient) {
    this.s3Client = new S3Client({ 
      region: this.region,
      credentials: {
        accessKeyId: 'AKIAQ3EGT7NWYFY4BQIQ',
        secretAccessKey: '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'
      }
    });
  }

  getSeries(): Observable<any> {
    return this.http.get(`https://${this.bucketName}.s3.${this.region}.amazonaws.com/series.json`);
  }

  getSeriesAudioFiles(seriesName: string): Observable<AudioFile[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: `${seriesName}/`,
      MaxKeys: 100
    });

    return from(this.s3Client.send(command)).pipe(
      map(response => {
        return (response.Contents || [])
          .filter(item => item.Key?.endsWith('.mp3'))
          .map(item => ({
            url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${item.Key}`,
            title: item.Key?.split('/').pop()?.replace('.mp3', '') || '',
            duration: '3:00'
          }));
      })
    );
  }
}