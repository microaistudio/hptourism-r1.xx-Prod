const fs = require('fs');
const file = './client/src/pages/existing-owner-onboarding.tsx';
let content = fs.readFileSync(file, 'utf8');

const insertPos = content.indexOf('<Card>');

const gateJSX = `

      {!isPreQualified && !existingApplication && (
        <Card className="border-primary shadow-sm bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Verify Current Certificate
            </CardTitle>
            <CardDescription>
              To ensure you are routed to the correct process, please provide your current RC details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid gap-4 md:grid-cols-6 lg:grid-cols-5">
                  <FormField
                    control={form.control}
                    name="rcNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3 lg:col-span-1">
                        <FormLabel>RC / Certificate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="HP-HS-XXXX-000123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rcIssueDate"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3 lg:col-span-1">
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                          <Input type="date" min={cutoffIsoDate} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certificateValidityYears"
                    render={({ field }) => (
                      <FormItem className="md:col-span-4 lg:col-span-2">
                        <FormLabel className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Validity Period
                        </FormLabel>
                        <FormControl>
                          <div className="h-9 flex items-center">
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex gap-4"
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="1" id="gate-val-1" />
                                <label htmlFor="gate-val-1" className="text-sm cursor-pointer">1 Yr</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="2" id="gate-val-2" />
                                <label htmlFor="gate-val-2" className="text-sm cursor-pointer">2 Yrs</label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="3" id="gate-val-3" />
                                <label htmlFor="gate-val-3" className="text-sm cursor-pointer">3 Yrs</label>
                              </div>
                            </RadioGroup>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={handleVerifyClick} className="w-full sm:w-auto">
              Verify Certificate <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {showRenewalAlert && !existingApplication && (
        <Alert className="border-amber-400 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 text-lg font-bold">Renewal Required</AlertTitle>
          <AlertDescription className="text-amber-800 mt-2 space-y-4">
            <p>
              Your certificate expires on <strong>{form.watch("rcExpiryDate")}</strong> (within 90 days). 
              To ensure continuous compliance, your application must be processed as a standard <strong>Renewal</strong>.
            </p>
            <Button onClick={() => setLocation(\`/applications/renewal?rcNumber=\${form.watch("rcNumber") || ''}&issueDate=\${form.watch("rcIssueDate") || ''}\`)} className="bg-amber-600 hover:bg-amber-700 text-white">
              Proceed to Renewal Pipeline <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
`;

content = content.slice(0, insertPos) + gateJSX + content.slice(insertPos);

// Now wrap the rest of the form in {isPreQualified && (...)}
// Find '<Card>' and '      </Card>' after the insertPos

const cardStr = '<Card>';
const cardStart = content.indexOf(cardStr, insertPos + gateJSX.length);
// Find the closing </Card>
// Wait, there are multiple </Card> tags, but the main one ends around line 1030
const endMainCard = content.lastIndexOf('</Card>'); // This assumes the last </Card> in the file is the main form

let prefix = content.slice(0, cardStart);
let cardContent = content.slice(cardStart, endMainCard + 7);
let suffix = content.slice(endMainCard + 7);

cardContent = `{isPreQualified && (\n` + cardContent + `\n      )}`;

content = prefix + cardContent + suffix;

// Also I want to hide the nested RC fields if they are prequalified, so they don't see them twice.
// Since the fields are injected as grid cols, let's just leave them visible for now so they see what they verified, but make them disabled.
// Actually, it's safer to just let them be, React-Hook-Form handles it.

fs.writeFileSync(file, content, 'utf8');
console.log('Modified existing-owner-onboarding.tsx');
