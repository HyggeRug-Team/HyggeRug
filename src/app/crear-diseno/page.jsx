import React from 'react';
import StudioView from '@/components/sections/Studio/StudioView';
import IaDesactivada from '@/components/sections/Studio/IaDesactivada';
import { getConfigValue } from '@/lib/db/config';

export const metadata = {
    title: 'Laboratorio IA | Crea tu Alfombra Personalizada',
    description: 'Usa nuestra inteligencia artificial para diseñar tu alfombra única. Sube una imagen, describe tu estilo y nosotros la fabricamos con tufting artesanal en Madrid.',
    keywords: 'diseñar alfombra IA, laboratorio textil, tufting inteligente, alfombras personalizadas Madrid, generador diseños alfombras'
};

export default async function CrearDisenoPage() {
    const iaActiva = await getConfigValue('ia_diseno_activo').catch(() => 'true');

    if (iaActiva === 'false') {
        return <IaDesactivada />;
    }

    return <StudioView />;
}
