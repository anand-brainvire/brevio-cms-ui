export type ColArrType = {
  name: string;
  sortable: boolean;
  fildName: string;
};
export type PaginationProps = {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: string;
  search: string;
};
export type NotificationProps = {
  onSearchNotification: (values: FilterNotificationProps) => void;
};
export type FilterNotificationProps = {
  search: string;
};
export type CreateNotification = {
  template: string;
  status?: number;
};
