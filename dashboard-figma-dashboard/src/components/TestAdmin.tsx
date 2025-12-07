import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Settings, Heart, Languages, MapPin, Code2, Upload } from 'lucide-react';

interface TestAdminProps {
  isAuthenticated: boolean;
}

export function TestAdmin({ isAuthenticated }: TestAdminProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!isAuthenticated}>
          <Settings className="h-4 w-4 mr-2" />
          Test Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Test Admin Settings</DialogTitle>
          <DialogDescription>
            Test version to verify tabs are working
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="emotions" className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-shrink-0 mb-4">
            <TabsList className="flex h-12 w-max min-w-full">
              <TabsTrigger value="emotions" className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <Heart className="h-4 w-4" />
                <span>Emotions</span>
              </TabsTrigger>
              <TabsTrigger value="languages" className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <Languages className="h-4 w-4" />
                <span>Languages</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <MapPin className="h-4 w-4" />
                <span>Locations</span>
              </TabsTrigger>
              <TabsTrigger value="apis" className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <Code2 className="h-4 w-4" />
                <span>APIs</span>
              </TabsTrigger>
              <TabsTrigger value="csv-data" className="flex items-center gap-2 px-4 py-2 whitespace-nowrap">
                <Upload className="h-4 w-4" />
                <span>CSV Data</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="emotions">
              <Card>
                <CardHeader>
                  <CardTitle>Emotions Tab</CardTitle>
                  <CardDescription>This is the emotions tab content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Emotions content is visible!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages">
              <Card>
                <CardHeader>
                  <CardTitle>Languages Tab</CardTitle>
                  <CardDescription>This is the languages tab content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Languages content is visible!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations">
              <Card>
                <CardHeader>
                  <CardTitle>Locations Tab</CardTitle>
                  <CardDescription>This is the locations tab content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Locations content is visible!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apis">
              <Card>
                <CardHeader>
                  <CardTitle>APIs Tab</CardTitle>
                  <CardDescription>This is the APIs tab content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>APIs content is visible!</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="csv-data">
              <Card>
                <CardHeader>
                  <CardTitle>CSV Data Tab</CardTitle>
                  <CardDescription>This is the CSV data tab content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>CSV Data content is visible!</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}