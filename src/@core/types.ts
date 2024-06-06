import type { I18nLanguage, LayoutConfig } from '@layouts/types'
import type { LiteralUnion, ValueOf } from 'type-fest'
import type { Skins } from './enums'

interface ExplicitThemeConfig {
  app: {
    i18n: {
      defaultLocale: string
      langConfig: I18nLanguage[]
    }
    theme: LiteralUnion<'light' | 'dark' | 'system', string>
    skin: ValueOf<typeof Skins>
  }
  verticalNav: {
    isVerticalNavSemiDark: boolean
  }
}

export type UserThemeConfig = LayoutConfig & ExplicitThemeConfig

// SECTION Custom Input
export interface CustomInputContent {
  title: string
  desc?: string
  value: string
  subtitle?: string
  icon?: string | object
  images?: string
}

export interface User {
   cni: string,
   nom?: string,
   prenom?: string,
   matricule?: string,
   promotion?: number,
   grade?: string,
   telephone?: string,
   ville?: string,
   imageUrl?:string
}

export interface GridColumn {
  cols?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
  xxl?: string
}

// Data table
export interface SortItem { key: string; order?: boolean | 'asc' | 'desc' }

export interface Options {
  page: number
  itemsPerPage: number
  sortBy: readonly SortItem[]
  groupBy: readonly SortItem[]
  search: string | undefined
}


export enum ProgramId{
  ISI,GI,MF,IIR
}
export enum PaymentType{
    CASH="CASH",
    CHECK="CHECK",
    TRANSFER="TRANSFER",
    DEPOSIT="DEPOSIT"
}
export enum PaymentStatus{
    CREATED,
    VALIDATED,
    REJECTED
}
export interface Student {
  id:number
  firstName:string
  lastName:string
  email:string
  code:string
  programId :ProgramId
}

//👉 - pdfUrl ===> in the backend (receipt) 
export interface Payment {
  id:number
  date:Date
  amount:number
  type:PaymentType
  status:PaymentStatus
  pdfUrl :string
}



