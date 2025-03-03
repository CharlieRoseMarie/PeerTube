import { catchError, map } from 'rxjs/operators'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { SortMeta } from 'primeng/primeng'
import { Observable } from 'rxjs'
import { ActorFollow, ResultList } from '@shared/index'
import { environment } from '../../../environments/environment'
import { RestExtractor, RestPagination, RestService } from '../rest'

@Injectable()
export class FollowService {
  private static BASE_APPLICATION_URL = 'https://peertube2.cpy.re' + '/api/v1/server'

  constructor (
    private authHttp: HttpClient,
    private restService: RestService,
    private restExtractor: RestExtractor
  ) {
  }

  getFollowing (pagination: RestPagination, sort: SortMeta, search?: string): Observable<ResultList<ActorFollow>> {
    let params = new HttpParams()
    params = this.restService.addRestGetParams(params, pagination, sort)

    if (search) params = params.append('search', search)

    return this.authHttp.get<ResultList<ActorFollow>>(FollowService.BASE_APPLICATION_URL + '/following', { params })
               .pipe(
                 map(res => this.restExtractor.convertResultListDateToHuman(res)),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }

  getFollowers (pagination: RestPagination, sort: SortMeta, search?: string): Observable<ResultList<ActorFollow>> {
    let params = new HttpParams()
    params = this.restService.addRestGetParams(params, pagination, sort)

    if (search) params = params.append('search', search)

    return this.authHttp.get<ResultList<ActorFollow>>(FollowService.BASE_APPLICATION_URL + '/followers', { params })
               .pipe(
                 map(res => this.restExtractor.convertResultListDateToHuman(res)),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }

  follow (notEmptyHosts: string[]) {
    const body = {
      hosts: notEmptyHosts
    }

    return this.authHttp.post(FollowService.BASE_APPLICATION_URL + '/following', body)
               .pipe(
                 map(this.restExtractor.extractDataBool),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }

  unfollow (follow: ActorFollow) {
    return this.authHttp.delete(FollowService.BASE_APPLICATION_URL + '/following/' + follow.following.host)
               .pipe(
                 map(this.restExtractor.extractDataBool),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }

  acceptFollower (follow: ActorFollow) {
    const handle = follow.follower.name + '@' + follow.follower.host

    return this.authHttp.post(`${FollowService.BASE_APPLICATION_URL}/followers/${handle}/accept`, {})
               .pipe(
                 map(this.restExtractor.extractDataBool),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }

  rejectFollower (follow: ActorFollow) {
    const handle = follow.follower.name + '@' + follow.follower.host

    return this.authHttp.post(`${FollowService.BASE_APPLICATION_URL}/followers/${handle}/reject`, {})
               .pipe(
                 map(this.restExtractor.extractDataBool),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }

  removeFollower (follow: ActorFollow) {
    const handle = follow.follower.name + '@' + follow.follower.host

    return this.authHttp.delete(`${FollowService.BASE_APPLICATION_URL}/followers/${handle}`)
               .pipe(
                 map(this.restExtractor.extractDataBool),
                 catchError(res => this.restExtractor.handleError(res))
               )
  }
}
