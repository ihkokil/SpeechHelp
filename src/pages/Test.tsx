
import { supabase } from '@/integrations/supabase/client';
import { FC, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import PricingPlans from '@/components/PricingPlans';

const Test: FC = () => {

	return (
		<div className="min-h-screen flex items-center justify-center">
			<PricingPlans />
		</div>
	);
};

export default Test;
