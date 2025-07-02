import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    hotelName: '',
    fullName: '',
    email: '',
    workPhone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!"
    });
    // Reset form
    setFormData({
      hotelName: '',
      fullName: '',
      email: '',
      workPhone: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Contact us for inquiries, support and partnership opportunities
          </h1>
        </div>

        <Card className="bg-muted/30 shadow-elegant">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="hotelName" className="text-base font-medium text-muted-foreground">
                  Hotel / Group Name
                </Label>
                <Input
                  id="hotelName"
                  name="hotelName"
                  type="text"
                  placeholder="Enter your Hotel or Group Name"
                  value={formData.hotelName}
                  onChange={handleInputChange}
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fullName" className="text-base font-medium text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your work Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="workPhone" className="text-base font-medium text-muted-foreground">
                  Work Phone
                </Label>
                <Input
                  id="workPhone"
                  name="workPhone"
                  type="tel"
                  placeholder="Enter your work phone number"
                  value={formData.workPhone}
                  onChange={handleInputChange}
                  className="mt-2 h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-base font-medium text-muted-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="mt-2 min-h-32"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Contact Us
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-primary">
            Reach out to our representative offices worldwide
          </h2>
        </div>
      </div>
    </div>
  );
}