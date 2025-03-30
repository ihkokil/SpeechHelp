
import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  Calendar, 
  Search,
  BadgePercent,
  Users,
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AdminBillingManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Mock data for the billing page
  const plans = [
    {
      id: 'plan_free',
      name: 'Free',
      price: 0,
      period: 'month',
      features: ['1 speech per month', 'Basic templates', 'Email support'],
      isActive: true
    },
    {
      id: 'plan_pro',
      name: 'Pro',
      price: 9.99,
      period: 'month',
      features: ['5 speeches per month', 'All templates', 'Priority support', 'Speech analytics'],
      isActive: true
    },
    {
      id: 'plan_premium',
      name: 'Premium',
      price: 19.99,
      period: 'month',
      features: ['Unlimited speeches', 'All templates', 'Premium support', 'Advanced analytics', 'Custom branding'],
      isActive: true
    },
    {
      id: 'plan_annual',
      name: 'Annual',
      price: 99.99,
      period: 'year',
      features: ['Unlimited speeches', 'All templates', 'Premium support', 'Advanced analytics', 'Custom branding', '45% savings vs monthly'],
      isActive: true
    }
  ];
  
  const subscriptions = [
    {
      id: 'sub_123456',
      user_email: 'john.doe@example.com',
      plan: 'Premium',
      status: 'active',
      start_date: '2023-10-15',
      next_billing: '2023-11-15',
      amount: 19.99
    },
    {
      id: 'sub_234567',
      user_email: 'jane.smith@example.com',
      plan: 'Pro',
      status: 'active',
      start_date: '2023-09-20',
      next_billing: '2023-10-20',
      amount: 9.99
    },
    {
      id: 'sub_345678',
      user_email: 'robert.johnson@example.com',
      plan: 'Annual',
      status: 'active',
      start_date: '2023-06-05',
      next_billing: '2024-06-05',
      amount: 99.99
    },
    {
      id: 'sub_456789',
      user_email: 'sarah.williams@example.com',
      plan: 'Pro',
      status: 'past_due',
      start_date: '2023-08-12',
      next_billing: '2023-10-12',
      amount: 9.99
    },
    {
      id: 'sub_567890',
      user_email: 'michael.brown@example.com',
      plan: 'Premium',
      status: 'canceled',
      start_date: '2023-07-18',
      next_billing: 'N/A',
      amount: 19.99
    }
  ];

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePlan = (planId: string) => {
    toast({
      title: "Plan Updated",
      description: `Plan visibility has been updated.`,
    });
  };

  const handleEditPlan = (planId: string) => {
    toast({
      title: "Edit Plan",
      description: "Plan editing functionality will be implemented here.",
    });
  };

  const extendSubscription = (subId: string) => {
    toast({
      title: "Subscription Extended",
      description: "Subscription has been extended by 30 days.",
    });
  };

  const cancelSubscription = (subId: string) => {
    toast({
      title: "Subscription Canceled",
      description: "Subscription has been canceled successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-purple-600" />
            <h1 className="text-2xl font-bold">Billing & Plans</h1>
          </div>
        </div>
        
        {/* Subscription Plans Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2 text-purple-600" />
              Subscription Plans
            </CardTitle>
            <CardDescription>
              Manage the plans available to users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <Card key={plan.id} className={!plan.isActive ? "opacity-70" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle>{plan.name}</CardTitle>
                      <Badge variant={!plan.isActive ? "outline" : "default"}>
                        {!plan.isActive ? "Inactive" : "Active"}
                      </Badge>
                    </div>
                    <div className="flex items-baseline mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <BadgePercent className="h-4 w-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTogglePlan(plan.id)}
                    >
                      {plan.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleEditPlan(plan.id)}
                    >
                      Edit Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* User Subscriptions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              User Subscriptions
            </CardTitle>
            <CardDescription>
              View and manage all user subscriptions.
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by email, plan, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.user_email}</TableCell>
                        <TableCell>{sub.plan}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sub.status === 'active' ? 'default' :
                            sub.status === 'past_due' ? 'destructive' : 'outline'
                          }>
                            {sub.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{sub.start_date}</TableCell>
                        <TableCell>{sub.next_billing}</TableCell>
                        <TableCell>${sub.amount}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => extendSubscription(sub.id)}
                              disabled={sub.status === 'canceled'}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Extend
                            </Button>
                            {sub.status !== 'canceled' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => cancelSubscription(sub.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No subscriptions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBillingManagement;
