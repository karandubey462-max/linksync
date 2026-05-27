#include <iostream>
using namespace std;
 int main()
 {
    char name;
    cout<<"Enter the character name:";
    cin>>name;
      
    switch(name)
    {
        case 'a':
        cout<<"rohit"<<endl;
        case 'b':
        cout<<"sohit"<<endl;
        
        default:
        cout<<"karan";
        
        case 'c':
           cout<<"mangal";

    }
 }