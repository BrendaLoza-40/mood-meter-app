import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Settings, Plus, Trash2, Save, Languages, MapPin, Code2, Heart, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { AppConfig, Language, Location, APIConfiguration, CustomEmotion, loadConfig, saveConfig, CORRELATION_METRICS, API_TEMPLATES } from '../utils/appConfig';

type L1Category = 'high_energy_pleasant' | 'high_energy_unpleasant' | 'low_energy_unpleasant' | 'low_energy_pleasant';

interface AdminSettingsProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function AdminSettings({ isAuthenticated, onLogout }: AdminSettingsProps) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<AppConfig>(loadConfig());

  // Language Management
  const [newLanguageCode, setNewLanguageCode] = useState('');
  const [newLanguageName, setNewLanguageName] = useState('');

  // Location Management
  const [newLocationName, setNewLocationName] = useState('');

  // API Management
  const [newApiName, setNewApiName] = useState('');
  const [newApiEndpoint, setNewApiEndpoint] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiDescription, setNewApiDescription] = useState('');
  const [newApiDataType, setNewApiDataType] = useState<'weather' | 'air_quality' | 'school_events' | 'academic' | 'social' | 'custom'>('custom');
  const [selectedCorrelationMetrics, setSelectedCorrelationMetrics] = useState<string[]>([]);

  // Custom Emotion Management
  const [newEmotionName, setNewEmotionName] = useState('');
  const [newEmotionCategory, setNewEmotionCategory] = useState<L1Category>('high_energy_pleasant');

  const handleSaveConfig = () => {
    saveConfig(config);
    toast.success('Settings saved successfully!');
  };

  // Language handlers
  const addLanguage = () => {
    if (!newLanguageCode || !newLanguageName) {
      toast.error('Please enter both language code and name');
      return;
    }
    
    if (config.languages.find(lang => lang.code === newLanguageCode)) {
      toast.error('Language code already exists');
      return;
    }

    const newLanguage: Language = {
      code: newLanguageCode.toLowerCase(),
      name: newLanguageName,
      enabled: true
    };

    setConfig({
      ...config,
      languages: [...config.languages, newLanguage]
    });

    setNewLanguageCode('');
    setNewLanguageName('');
    toast.success(`Added language: ${newLanguageName}`);
  };

  const toggleLanguage = (code: string, enabled: boolean) => {
    setConfig({
      ...config,
      languages: config.languages.map(lang =>
        lang.code === code ? { ...lang, enabled } : lang
      )
    });
  };

  const removeLanguage = (code: string) => {
    if (config.defaultLanguage === code) {
      toast.error('Cannot remove the default language');
      return;
    }

    setConfig({
      ...config,
      languages: config.languages.filter(lang => lang.code !== code)
    });
    toast.success('Language removed');
  };

  // Location handlers
  const addLocation = () => {
    if (!newLocationName) {
      toast.error('Please enter a location name');
      return;
    }

    const newLocation: Location = {
      id: Date.now().toString(),
      name: newLocationName,
      enabled: true
    };

    setConfig({
      ...config,
      locations: [...config.locations, newLocation]
    });

    setNewLocationName('');
    toast.success(`Added location: ${newLocationName}`);
  };

  const toggleLocation = (id: string, enabled: boolean) => {
    setConfig({
      ...config,
      locations: config.locations.map(loc =>
        loc.id === id ? { ...loc, enabled } : loc
      )
    });
  };

  const removeLocation = (id: string) => {
    setConfig({
      ...config,
      locations: config.locations.filter(loc => loc.id !== id)
    });
    toast.success('Location removed');
  };

  // API handlers
  const addAPI = () => {
    if (!newApiName || !newApiEndpoint) {
      toast.error('Please enter API name and endpoint');
      return;
    }

    if (selectedCorrelationMetrics.length === 0) {
      toast.error('Please select at least one correlation metric');
      return;
    }

    const newAPI: APIConfiguration = {
      id: Date.now().toString(),
      name: newApiName,
      endpoint: newApiEndpoint,
      apiKey: newApiKey || 'YOUR_API_KEY_HERE',
      enabled: false,
      description: newApiDescription || '',
      correlationMetrics: selectedCorrelationMetrics,
      dataType: newApiDataType
    };

    setConfig({
      ...config,
      apiConfigurations: [...config.apiConfigurations, newAPI]
    });

    // Reset form
    setNewApiName('');
    setNewApiEndpoint('');
    setNewApiKey('');
    setNewApiDescription('');
    setNewApiDataType('custom');
    setSelectedCorrelationMetrics([]);
    toast.success(`Added API: ${newApiName}`);
  };

  // Correlation metrics helpers
  const handleDataTypeChange = (dataType: typeof newApiDataType) => {
    setNewApiDataType(dataType);
    setSelectedCorrelationMetrics([]); // Reset metrics when data type changes
  };

  const toggleCorrelationMetric = (metric: string) => {
    setSelectedCorrelationMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const getAvailableMetrics = () => {
    return CORRELATION_METRICS[newApiDataType] || [];
  };

  // Quick setup from templates
  const setupFromTemplate = (templateKey: keyof typeof API_TEMPLATES) => {
    const template = API_TEMPLATES[templateKey];
    setNewApiName(template.name);
    setNewApiEndpoint(template.endpoint);
    setNewApiDescription(template.description);
    setNewApiDataType(template.dataType);
    setSelectedCorrelationMetrics(template.suggestedMetrics);
  };

  const toggleAPI = (id: string, enabled: boolean) => {
    setConfig({
      ...config,
      apiConfigurations: config.apiConfigurations.map(api =>
        api.id === id ? { ...api, enabled } : api
      )
    });
  };

  const removeAPI = (id: string) => {
    setConfig({
      ...config,
      apiConfigurations: config.apiConfigurations.filter(api => api.id !== id)
    });
    toast.success('API removed');
  };

  // Custom Emotion handlers
  const addCustomEmotion = () => {
    if (!newEmotionName) {
      toast.error('Please enter an emotion name');
      return;
    }

    const newEmotion: CustomEmotion = {
      id: Date.now().toString(),
      name: newEmotionName,
      l1Category: newEmotionCategory,
      translations: {}
    };

    setConfig({
      ...config,
      customEmotions: [...config.customEmotions, newEmotion]
    });

    setNewEmotionName('');
    toast.success(`Added emotion: ${newEmotionName}`);
  };

  const removeCustomEmotion = (id: string) => {
    setConfig({
      ...config,
      customEmotions: config.customEmotions.filter(emotion => emotion.id !== id)
    });
    toast.success('Custom emotion removed');
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
    toast.success('Logged out successfully');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!isAuthenticated}>
          <Settings className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Admin Settings</DialogTitle>
              <DialogDescription>
                Manage emotions, languages, locations, and API configurations
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="emotions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emotions">
              <Heart className="h-4 w-4 mr-2" />
              Emotions
            </TabsTrigger>
            <TabsTrigger value="languages">
              <Languages className="h-4 w-4 mr-2" />
              Languages
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="apis">
              <Code2 className="h-4 w-4 mr-2" />
              APIs
            </TabsTrigger>
          </TabsList>

          {/* Custom Emotions Tab */}
          <TabsContent value="emotions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Emotion</CardTitle>
                <CardDescription>
                  Add new L2 emotions to any L1 category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emotion-name">Emotion Name</Label>
                    <Input
                      id="emotion-name"
                      placeholder="e.g., Overwhelmed"
                      value={newEmotionName}
                      onChange={(e) => setNewEmotionName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emotion-category">L1 Category</Label>
                    <Select value={newEmotionCategory} onValueChange={(value) => setNewEmotionCategory(value as L1Category)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_energy_pleasant">High Energy Pleasant</SelectItem>
                        <SelectItem value="high_energy_unpleasant">High Energy Unpleasant</SelectItem>
                        <SelectItem value="low_energy_unpleasant">Low Energy Unpleasant</SelectItem>
                        <SelectItem value="low_energy_pleasant">Low Energy Pleasant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addCustomEmotion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Emotion
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Emotions ({config.customEmotions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.customEmotions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No custom emotions added yet</p>
                ) : (
                  config.customEmotions.map((emotion) => (
                    <div key={emotion.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{emotion.name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {emotion.l1Category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomEmotion(emotion.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Language</CardTitle>
                <CardDescription>
                  Add support for additional languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lang-code">Language Code</Label>
                    <Input
                      id="lang-code"
                      placeholder="e.g., ko"
                      value={newLanguageCode}
                      onChange={(e) => setNewLanguageCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lang-name">Language Name</Label>
                    <Input
                      id="lang-name"
                      placeholder="e.g., Korean"
                      value={newLanguageName}
                      onChange={(e) => setNewLanguageName(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={addLanguage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Installed Languages ({config.languages.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.languages.map((lang) => (
                  <div key={lang.code} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={lang.enabled}
                        onCheckedChange={(checked) => toggleLanguage(lang.code, checked)}
                      />
                      <div>
                        <p>{lang.name}</p>
                        <p className="text-sm text-muted-foreground">{lang.code}</p>
                      </div>
                      {lang.code === config.defaultLanguage && (
                        <Badge>Default</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(lang.code)}
                      disabled={lang.code === config.defaultLanguage}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Location</CardTitle>
                <CardDescription>
                  Add kiosk locations for mood meter tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location-name">Location Name</Label>
                  <Input
                    id="location-name"
                    placeholder="e.g., Science Building - 3rd Floor"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                  />
                </div>
                <Button onClick={addLocation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Locations ({config.locations.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.locations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={location.enabled}
                        onCheckedChange={(checked) => toggleLocation(location.id, checked)}
                      />
                      <p>{location.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLocation(location.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add API Configuration</CardTitle>
                <CardDescription>
                  Configure external APIs for data correlation and analysis. Start with a template or create custom configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Setup Templates */}
                <div className="space-y-3">
                  <Label>Quick Setup Templates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setupFromTemplate('purpleair')}
                      className="justify-start text-xs h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="font-medium">PurpleAir</div>
                        <div className="text-muted-foreground">Air Quality</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setupFromTemplate('openweather')}
                      className="justify-start text-xs h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="font-medium">OpenWeather</div>
                        <div className="text-muted-foreground">Weather Data</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setupFromTemplate('weatherapi')}
                      className="justify-start text-xs h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="font-medium">WeatherAPI</div>
                        <div className="text-muted-foreground">Weather Data</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setupFromTemplate('google_calendar')}
                      className="justify-start text-xs h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="font-medium">Google Calendar</div>
                        <div className="text-muted-foreground">School Events</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm font-medium">Manual Configuration</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-name">API Name</Label>
                  <Input
                    id="api-name"
                    placeholder="e.g., Student Information System"
                    value={newApiName}
                    onChange={(e) => setNewApiName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">Endpoint URL</Label>
                  <Input
                    id="api-endpoint"
                    placeholder="https://api.example.com/v1/data"
                    value={newApiEndpoint}
                    onChange={(e) => setNewApiEndpoint(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key (Optional)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter API key"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-data-type">Data Type</Label>
                  <Select value={newApiDataType} onValueChange={handleDataTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weather">Weather Data</SelectItem>
                      <SelectItem value="air_quality">Air Quality</SelectItem>
                      <SelectItem value="school_events">School Events</SelectItem>
                      <SelectItem value="academic">Academic Data</SelectItem>
                      <SelectItem value="social">Social Data</SelectItem>
                      <SelectItem value="custom">Custom Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Correlation Metrics</Label>
                  <p className="text-sm text-muted-foreground">
                    Select the metrics you want to correlate with mood data
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {getAvailableMetrics().map((metric) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox
                          id={`metric-${metric}`}
                          checked={selectedCorrelationMetrics.includes(metric)}
                          onCheckedChange={() => toggleCorrelationMetric(metric)}
                        />
                        <Label 
                          htmlFor={`metric-${metric}`}
                          className="text-sm cursor-pointer"
                        >
                          {metric}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedCorrelationMetrics.length} metric{selectedCorrelationMetrics.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-description">Description</Label>
                  <Textarea
                    id="api-description"
                    placeholder="Describe what this API is used for"
                    value={newApiDescription}
                    onChange={(e) => setNewApiDescription(e.target.value)}
                  />
                </div>
                <Button onClick={addAPI}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add API
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Configurations ({config.apiConfigurations.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.apiConfigurations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No API configurations added yet</p>
                ) : (
                  config.apiConfigurations.map((api) => (
                    <div key={api.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={api.enabled}
                            onCheckedChange={(checked: any) => toggleAPI(api.id, checked)}
                          />
                          <div>
                            <p className="font-medium">{api.name}</p>
                            <p className="text-sm text-muted-foreground">{api.endpoint}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {api.dataType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Custom'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {api.correlationMetrics?.length || 0} metrics
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAPI(api.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      {api.description && (
                        <p className="text-sm text-muted-foreground pl-10">{api.description}</p>
                      )}
                      {api.correlationMetrics && api.correlationMetrics.length > 0 && (
                        <div className="pl-10">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Correlation Metrics:</p>
                          <div className="flex flex-wrap gap-1">
                            {api.correlationMetrics.slice(0, 3).map((metric) => (
                              <Badge key={metric} variant="secondary" className="text-xs">
                                {metric.split(' ').slice(0, 3).join(' ')}...
                              </Badge>
                            ))}
                            {api.correlationMetrics.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{api.correlationMetrics.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveConfig}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
