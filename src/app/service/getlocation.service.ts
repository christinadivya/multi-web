import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetlocationService {

  lat;
  lng;
  currentAdddres: any;


  constructor(private http: HttpClient) { }


  getCurrentIpAdd() {
    return this.http.get('https://jsonip.com/', {});
  }

  getIp(ip) {
    return this.http.get('http://ip-api.com/json/' + ip);
  }

  getAddressFromGoogle(lat, lng) {
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + ',' + lng + "&key=" + environment.googlekey);
  }

      getCurrentLocation() {
        if (window.navigator && window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(
            (showPosition) => {
              this.lat = showPosition.coords.latitude;
              this.lng = showPosition.coords.longitude;
              this.getAddressBasedonLatandLng(this.lat, this.lng, 'initial');
            },
            showError => {
              console.log(showError);
              this.getCurrentIPAddress();
            });
        } else {
          this.getCurrentIPAddress();
        }
        return this.currentAdddres;
      }

      getCurrentIPAddress() {
        this.getCurrentIpAdd().subscribe(
          res => {
            if (res && res['ip']) {
              // console.log(res['ip']);
              this.getAddressBasedonCurrentIp(res['ip']);
            }
          },
          err => {
            console.log(err);
          }
        );
      }


      getAddressBasedonCurrentIp(ip) {
        this.getIp(ip).subscribe(
          res => {
            // console.log(res);

            if (res && res['status'] == 'success' && res['lat'] && res['lon']) {
              localStorage.setItem('lat', res['lat']); // = res["lat"];
              localStorage.setItem('lng', res['lon']);
              this.getAddressBasedonLatandLng(res['lat'], res['lon'], 'initial');
            }
          },
          err => {
            console.log(err);
          }
        );
      }

      getAddressBasedonLatandLng(latitude, longitude, type) {
        // console.log("lat"+ latitude);
        // console.log("lng"+ longitude);
        if (latitude && longitude) {

          this.getAddressFromGoogle(latitude, longitude).subscribe(
            res => {

              this.currentAdddres = {
                country: null,
                city: null,
                state: null,
                country_short_name: null
              };


              if (res && res['status'] && (res['status'] == 'ok' || res['status'] == 'OK')) {

                if (res['results'][0]) {
                  // console.log(res["results"][0]);


                  for (let index = 0; index < res['results'][0]['address_components'].length; index++) {

                    if (res['results'][0]['address_components'][index]['types'][0] == 'country') {

                      this.currentAdddres.country = res['results'][0]['address_components'][index]['long_name'];
                      this.currentAdddres.country_short_name = res['results'][0]['address_components'][index]['short_name'];

                    }

                    if (res['results'][0]['address_components'][index]['types'][0] == 'administrative_area_level_2') {
                      this.currentAdddres.city = res['results'][0]['address_components'][index]['long_name'];
                    }

                    if (res['results'][0]['address_components'][index]['types'][0] == 'administrative_area_level_1') {
                      this.currentAdddres.state = res['results'][0]['address_components'][index]['long_name'];
                    }


                  }


                  console.log(this.currentAdddres);
 
                  return this.currentAdddres;

                }
              }

            },
            err => {
              console.log(err);
            }
          );
        }

      }



}
