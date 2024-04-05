import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export default class MusicAPIService {
  private readonly axiosInstance

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('BASE_MUSIC_API_URL'),
      params: {
        client_id: this.configService.get('CLIENT_ID'),
        format: 'json'
      }
    })
  }

  async get(url: string, params?: any): Promise<any> {
    const response = await this.axiosInstance.get(url, { params })
    return response.data
  }
}
