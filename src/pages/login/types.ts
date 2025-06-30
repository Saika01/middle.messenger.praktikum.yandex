export interface LoginPageProps {
    events?: {
        submit: (e: Event) => void;
    };
    error?: string;
}
