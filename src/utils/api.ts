import { api } from "../networks/axiosInstance";
//import type { HeaderData, HeroData, AboutData, PortfolioItem, ContactData, FooterData, ServiceData } from "../types";

// export const fetchHeader = () => api.get<HeaderData>("/header").then(r => r.data);
// export const fetchHero = () => api.get<HeroData>("/hero").then(r => r.data);
// export const fetchAbout = () => api.get<AboutData>("/about").then(r => r.data);
// export const fetchPortfolio = () => api.get<PortfolioItem[]>("/portfolio").then(r => r.data);
// export const fetchContact = () => api.get<ContactData>("/contact").then(r => r.data);
// export const fetchFooter = () => api.get<FooterData>("/footer").then(r => r.data);
// export const fetchServices = () => api.get<ServiceData[]>("/services").then(r => r.data);

// Course data type
export interface CourseData {
  id: number;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  studentsEnrolled: number;
  image: string;
}

export const fetchCourses = () => api.get<CourseData[]>("/courses").then(r => r.data);
export const fetchCourseById = (id: string) => api.get<CourseData>(`/courses/${id}`).then(r => r.data);


