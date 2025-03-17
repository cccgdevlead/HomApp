import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonBackButton,
  IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, chevronDown } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-help-center',
  template: `
    <ion-content>
      <div class="content-container">
        <!-- Header -->
        <div class="header">
          <div class="user-info">
            <ion-buttons>
              <ion-back-button defaultHref="/tabs/tab3"></ion-back-button>
            </ion-buttons>
            <h1>Help Center</h1>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="nav-tabs">
          <button 
            class="tab-button"
            [class.active]="activeTab === 'faq'"
            (click)="setActiveTab('faq')"
          >
            FAQ
          </button>
          <button 
            class="tab-button"
            [class.active]="activeTab === 'contact'"
            (click)="setActiveTab('contact')"
          >
            Contact us
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-container">
          <ion-icon name="search-outline"></ion-icon>
          <input 
            type="text" 
            placeholder="Search" 
            [(ngModel)]="searchQuery"
            (input)="filterFaqs()"
          >
        </div>

        <!-- FAQ List -->
        <div class="faq-list">
          <div 
            class="faq-item" 
            *ngFor="let item of filteredFaqs"
            [class.open]="item.isOpen"
          >
            <div class="faq-header" (click)="toggleFaq(item)">
              <h3>{{ item.question }}</h3>
              <ion-icon name="chevron-down"></ion-icon>
            </div>
            <div class="faq-content" *ngIf="item.isOpen">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .content-container {
      padding: 16px 16px 24px;
      background: #FFFFFF;
      min-height: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 0 4px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      h1 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #111827;
        margin: 0;
      }
    }

    .nav-tabs {
      display: flex;
      gap: 32px;
      margin-bottom: 24px;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 12px;
    }

    .tab-button {
      background: none;
      border: none;
      padding: 0;
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-size: 18px;
      color: #9CA3AF;
      cursor: pointer;
      position: relative;

      &.active {
        color: #111827;
        font-weight: 500;

        &:after {
          content: '';
          position: absolute;
          bottom: -13px;
          left: 0;
          right: 0;
          height: 2px;
          background: #111827;
        }
      }
    }

    .search-container {
      background: #F3F4F6;
      border-radius: 100px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;

      ion-icon {
        font-size: 20px;
        color: #6B7280;
      }

      input {
        border: none;
        background: none;
        width: 100%;
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        color: #111827;

        &::placeholder {
          color: #9CA3AF;
        }

        &:focus {
          outline: none;
        }
      }
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .faq-item {
      background: #F8FAFC;
      border-radius: 16px;
      overflow: hidden;

      .faq-header {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        h3 {
          margin: 0;
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #111827;
        }

        ion-icon {
          font-size: 20px;
          color: #111827;
          transition: transform 0.2s;
        }
      }

      &.open {
        .faq-header ion-icon {
          transform: rotate(180deg);
        }
      }

      .faq-content {
        padding: 0 20px 20px;

        p {
          margin: 0;
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #6B7280;
        }
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    FormsModule,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class HelpCenterPage {
  activeTab: 'faq' | 'contact' = 'faq';
  searchQuery: string = '';
  faqs: FaqItem[] = [
    {
      question: 'What is HoM?',
      answer: 'In late 2023, Hour of Meditation was launched to introduce more people to the limitless and scriptural benefits of meditation. At HoM, we take you on a journey of being connected with God and yourself on a deeper level through meditation.',
      isOpen: false
    },
    {
      question: 'How is HoM different from other forms of meditation?',
      answer: 'HoM focuses on Christian meditation practices, combining traditional meditation techniques with biblical principles and scripture.',
      isOpen: false
    },
    {
      question: 'Is meditation compatible with Christian beliefs?',
      answer: 'Yes, meditation has deep roots in Christian tradition, focusing on scripture contemplation and prayer.',
      isOpen: false
    },
    {
      question: 'When is the best time to meditate?',
      answer: 'The best time to meditate is whenever you can consistently dedicate uninterrupted time. Many find early morning or evening most effective.',
      isOpen: false
    },
    {
      question: 'Is it okay to fall asleep while I am meditating?',
      answer: 'While it is natural to sometimes feel sleepy during meditation, the goal is to maintain gentle awareness. If you regularly fall asleep, try meditating at a different time.',
      isOpen: false
    },
    {
      question: 'How can I overcome distractions when meditating?',
      answer: 'Acknowledge distractions without judgment and gently return your focus to your breath or meditation object. This is a normal part of the practice.',
      isOpen: false
    }
  ];
  filteredFaqs: FaqItem[] = this.faqs;

  constructor() {
    addIcons({ searchOutline, chevronDown });
  }

  setActiveTab(tab: 'faq' | 'contact') {
    this.activeTab = tab;
  }

  toggleFaq(item: FaqItem) {
    item.isOpen = !item.isOpen;
  }

  filterFaqs() {
    if (!this.searchQuery.trim()) {
      this.filteredFaqs = this.faqs;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredFaqs = this.faqs.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }
  }
}