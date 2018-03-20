import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { EventDetailComponent }  from './event-detail/event-detail.component';
import { EventsComponent }      from './events/events.component';
import { EventSearchComponent }  from './event-search/event-search.component';
import { EventService }          from './event.service';
import { MessageService }       from './message.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  declarations: [
    AppComponent,
    EventsComponent,
    EventDetailComponent,
    EventSearchComponent
  ],
  providers: [ EventService, MessageService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
