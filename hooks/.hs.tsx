// Dans votre application Next.js
import useSWR from 'swr';

const fetcher = async (url) => {
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!res.ok) {
        throw new Error('Une erreur est survenue lors de la récupération des données');
    }

    return res.json();
};

// Hook pour récupérer la liste des cours
export function useCourses(filters = {}) {
    const { level, category, tag, sort } = filters;

    let url = 'http://localhost:8000/api/courses/';
    const params = new URLSearchParams();

    if (level) params.append('level', level);
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (sort) params.append('sort', sort);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const { data, error } = useSWR(url, fetcher);

    return {
        courses: data?.results || [],
        isLoading: !error && !data,
        isError: error
    };
}

// Hook pour récupérer les détails d'un cours
export function useCourse(courseId) {
    const { data, error } = useSWR(
        courseId ? `http://localhost:8000/api/courses/${courseId}/` : null,
        fetcher
    );

    return {
        course: data,
        isLoading: !error && !data,
        isError: error
    };
}

// Hook pour récupérer les détails d'un module
export function useModule(moduleId) {
    const { data, error } = useSWR(
        moduleId ? `http://localhost:8000/api/modules/${moduleId}/` : null,
        fetcher
    );

    return {
        module: data,
        isLoading: !error && !data,
        isError: error
    };
}